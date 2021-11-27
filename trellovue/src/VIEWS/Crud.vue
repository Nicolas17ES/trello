<template>
  <div>
    <h1 id="projectname">Create a project</h1>

    <!-- create project -->

    <form @submit.prevent="createProject" class="add-form">
      <div class="form-control">
        <input
          type="project"
          v-model="project"
          name="project"
          placeholder="Add project"
        />
      </div>
      <input type="submit" value="Add Project" class="btn btn-block button3" />
    </form>
    <!-- end of create project -->

    <div v-for="(project, index) in projects" :key="index" class="project">
      <h1>{{ project.name }}</h1>

      <!-- create category -->

      <h3>CREATE CATEGORY</h3>
      <form @submit.prevent="addCat(project.id)" class="add-form">
        <div class="form-control">
          <input
            type="category"
            v-model="category"
            name="category"
            placeholder="Add Category"
          />
        </div>
        <input
          type="submit"
          value="Add Category"
          class="btn btn-block button3"
        />
      </form>

      <!-- end of create category -->

      <!-- display all categories -->

      <section class="allCats">
        <div
          class="category"
          v-for="(category, index) in categories"
          :key="index"
        >
          <section v-if="project.id === category.parent">
            <h1>{{ category.name }}</h1>
            <button @click="deleteCat(category.categoryId)">Delete cat</button>

            <!-- add a Task component -->
            <AddTask @add-task="addTask" :category="category.categoryId" />

            <div v-for="(post, index) in posts" :key="index">
              <div class="post" v-if="category.categoryId == post.categories">
                <ul>
                  <li>{{ post.id }}</li>
                  <button @click="deleteTask(post.id)">DELETE Task</button>
                  <li>{{ post.title }}</li>
                  <li>{{ post.content }}</li>

                  <!-- add comment -->
                  <form @submit.prevent="addComment(post.id)" class="add-form">
                    <div class="form-control">
                      <input
                        type="content"
                        v-model="commentContent"
                        name="content"
                        placeholder="Add Comment"
                      />
                    </div>
                    <input
                      type="submit"
                      value="Add comment"
                      class="btn btn-block button3"
                    />
                  </form>
                  <!-- end of  add comment -->


                  <div v-for="(comment, index) in comments" :key="index">
                    <ul v-if="comment.postId === post.id">
                      <li>{{ comment.content }}</li>
                      <button @click="deleteComment(comment.id)">X</button>
                    </ul>
                  </div>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>

    <!-- tasks -->
  </div>
</template>


<script>
import AddTask from "../components/addTask";

export default {
  components: {
    AddTask,
  },
  data() {
    return {
      posts: [],
      tokens: {},
      comments: [],
      categories: [],
      projects: [],
      commentContent: "",
      category: "",
      project: "",
    };
  },

  created() {
    this.getToken();
    this.getTasks();
    this.getComments();
    this.getCategories();
    this.getProjects();
  },

  methods: {
    //take tags out//
    cleanTags(value) {
      return value.replace(/<\/?[^>]+(>|$)/g, "");
    },

    //get Token from user

    async getToken() {
      try {
        const jwt = await fetch(
          "http://localhost:8000/wp-json/jwt-auth/v1/token",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ username: "admin", password: "12345" }),
          }
        );

        const data = await jwt.json();

        this.tokens = data;
      } catch (err) {
        console.log(err);
      }
    },

    //CRUD PARENT CATEGGORIES = PROJECTS//

    //get projects//
    async getProjects() {
      const res = await fetch("http://localhost:8000/wp-json/wp/v2/categories");
      const data = await res.json();
      await data.forEach((project) => {
        let projectObj = {};
        projectObj.id = project.id;
        projectObj.name = project.name;
        projectObj.parent = project.parent;
        // console.log(catObj.name)
        // console.log(catObj.parent)
        if (projectObj.parent === 0) {
          this.projects.push(projectObj);
          console.log(this.projects);
        }
      });
    },

    //create a project//
    async createProject() {
      if (!this.project) {
        alert("Please add a project");
      }

      const newProject = {
        name: this.project,
        parent: 0,
      };

      this.project = "";

      const res = await fetch(
        "http://localhost:8000/wp-json/wp/v2/categories",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${this.tokens.token}`,
          },
          body: JSON.stringify(newProject),
        }
      );
      const data = await res.json();
      this.projects = [...this.projects, data];
    },

    // CRUD CHILD CATEGORIES = CATEGORIES
    //get categories//
    async getCategories() {
      const res = await fetch(
        "http://localhost:8000/wp-json/wp/v2/categories"
      );
      const data = await res.json();

      await data.forEach((category) => {
        let catObj = {};
        catObj.categoryId = category.id;
        catObj.name = category.name;
        catObj.parent = category.parent;
        // console.log(catObj.name)
        // console.log(catObj.parent)
        if (catObj.parent > 0) {
          this.categories.push(catObj);
        }
      });
    },

    //create category

    async addCat(id) {
      if (!this.category) {
        alert("Please add a category");
      }

      const newCat = {
        name: this.category,
        parent: id,
      };

      this.category = "";

      const res = await fetch(
        "http://localhost:8000/wp-json/wp/v2/categories",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${this.tokens.token}`,
          },
          body: JSON.stringify(newCat),
        }
      );
      const data = await res.json();
      this.categories = [...this.categories, data];
    },

    //Delete categories
    async deleteCat(id) {
      const response = await fetch(
        `http://localhost:8000/wp-json/wp/v2/categories/${id}?force=true`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.tokens.token}`,
          },
        }
      );

      this.categories = this.categories.filter(
        (category) => category.categoryId !== id
      );
    },

    //CRUD POSTS//

    //get Posts

    async getTasks() {
      try {
        const res = await fetch("http://localhost:8000/wp-json/wp/v2/posts");
        const data = await res.json();

        await data.forEach((post) => {
          let postObj = {};
          postObj.id = post.id;
          postObj.title = post.title.rendered;
          postObj.content = this.cleanTags(post.content.rendered);
          postObj.date = post.date;
          postObj.status = post.status;
          postObj.categories = post.categories;
          this.posts.push(postObj);
        });
      } catch (err) {
        console.log(err);
      }
    },
    //do a post

    async addTask(newTask) {
      this.posts = [...this.posts, newTask];
      // newTask.categories = [2];
      try {
        const jwt = await fetch("http://localhost:8000/wp-json/wp/v2/posts", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${this.tokens.token}`,
          },
          body: JSON.stringify(newTask),
        });
        const data = await jwt.json();

        // const data = await jwt.json();
        // console.log(data);
      } catch (err) {
        console.log(err);
      }
    },

    //delete a post //

    async deleteTask(id) {
      try {
        const res = await fetch(
          `http://localhost:8000/wp-json/wp/v2/posts/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${this.tokens.token}`,
            },
          }
        );
        res.status === 200
          ? (this.posts = this.posts.filter((post) => post.id !== id))
          : alert(res.status);
      } catch (err) {
        console.log(err);
      }

      //delete comments of task//
    },

    //CRUD COMMENTS
    // get comments

    async getComments() {
      const response = await fetch(
        "http://localhost:8000/wp-json/wp/v2/comments"
      );
      const data = await response.json();

      await data.forEach((comment) => {
        let commentOBj = {};
        commentOBj.postId = comment.post;
        commentOBj.author = comment.author_name;
        commentOBj.id = comment.id;
        commentOBj.content = this.cleanTags(comment.content.rendered);
        this.comments.push(commentOBj);
      });
    },

    //add comment
    async addComment(id) {
      if (!this.commentContent) {
        alert("Please add a comment");
      }
      console.log(id);

      const newComment = {
        post: id,
        author_name: this.tokens.user_nicename,
        author_email: this.tokens.user_email,
        content: this.commentContent,
        status: "approved",
      };
      this.commentContent = "";

      const response = await fetch(
        "http://localhost:8000/wp-json/wp/v2/comments",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${this.tokens.token}`,
          },
          body: JSON.stringify(newComment),
        }
      );
      const data = await response.json();
      let newCommentOBj = {};
      newCommentOBj.postId = data.post;
      newCommentOBj.author = data.author_name;
      newCommentOBj.id = data.id;
      newCommentOBj.content = this.cleanTags(data.content.rendered);

      this.comments = [...this.comments, newCommentOBj];
    },

    //delete comment

    async deleteComment(id) {
      try {
        const res = await fetch(
          `http://localhost:8000/wp-json/wp/v2/comments/${id}?force=true`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${this.tokens.token}`,
            },
          }
        );
        res.status === 200
          ? (this.comments = this.comments.filter(
              (comment) => comment.id !== id
            ))
          : alert(res.status);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>


<style scoped>
#projectname {
  font-size: 3em;
}
.category {
  border: 2px black solid;
  width: 30%;
}

.allCats {
  display: flex;
  justify-content: space-evenly;
}

ul {
  list-style-type: none;
}

.post {
  border: rgb(235, 130, 148) dashed 2px;
}
</style>