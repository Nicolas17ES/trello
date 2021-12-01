<template>
  <div>
    <router-link to="/">Go Back to Home</router-link>

    <div v-for="(project, index) in projects" :key="index" class="project">
      <button @click="deleteProject(project.id)">X</button>
      <h1>{{ project.name }}</h1>
      <AddProject @edit-project="editProjectName" :id="project.id" />

      <!-- create a cateegory -->
      <h3>CREATE CATEGORY</h3>

      <AddCategory @add-category="addCat" :project="project.id" />

      <section class="allCats">
        <div
          class="category"
          v-for="(category, index) in categories"
          :key="index"
        >
          <section>
            <!-- delete and edit category -->

            <button @click="deleteCat(category.categoryId)">X</button>
            <h1>{{ category.name }}</h1>
            <AddCategory
              @edit-category="editCategoryName"
              :id="category.categoryId"
            />

            <!-- END OF delete and edit category -->

            <!-- add a Task component -->
            <h4>Add Task</h4>
            <AddTask @add-task="addTask" :category="category.categoryId" />
            <!-- END OF add a Task component -->

            <div v-for="(post, index) in posts" :key="index">
              <div class="post" v-if="category.categoryId == post.categories">
                <ul>
                  <li>{{ post.id }}</li>
                  <button @click="deleteTask(post.id)">X</button>
                  <li>{{ post.title }}</li>
                  <AddTask @edit-task="editPostName" :id="post.id" />

                  <!-- EDIT A POST -->
                  <!-- <form
                    @submit.prevent="editPostName(post.id)"
                    class="add-form"
                  >
                    <div class="form-control">
                      <input
                        type="editPost"
                        v-model="editPost"
                        name="editPost"
                        placeholder="Edit Post"
                      />
                    </div>
                    <input
                      type="submit"
                      value="Edit Post"
                      class="btn btn-block button3"
                    />
                  </form> -->
                  <!-- END OF EDIT A POST -->

                  <!-- add comment -->
                  <AddComment
                    @add-comment="addComment"
                    :post="post.id"
                    :tokens="tokens"
                  />

                  <!-- end of  add comment -->

                  <div v-for="(comment, index) in comments" :key="index">
                    <ul v-if="comment.postId === post.id">
                      <li>{{ comment.content }}</li>
                      <!-- delete comment -->
                      <button @click="deleteComment(comment.id)">X</button>

                      <!-- edit comment -->
                      <form
                        @submit.prevent="editCommentName(comment.id)"
                        class="add-form"
                      >
                        <div class="form-control">
                          <input
                            type="editComment"
                            v-model="editComment"
                            name="editComment"
                            placeholder="Edit comment"
                          />
                        </div>
                        <input
                          type="submit"
                          value="Edit comment"
                          class="btn btn-block button3"
                        />
                      </form>

                      <!-- end of edit comment -->
                    </ul>
                  </div>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import AddTask from "../components/addTask";
import AddCategory from "../components/addCategory";
import AddComment from "../components/addComment";
import AddProject from "../components/addProject";
export default {
  components: {
    AddTask,
    AddCategory,
    AddComment,
    AddProject,
  },
  name: "oneProject",
  data() {
    return {
      id: this.$route.params.id,
      posts: [],
      tokens: {},
      comments: [],
      categories: [],
      projects: [],
      commentContent: "",
      category: "",
      project: "",
      editProject: "",
      editCategory: "",
      editPost: "",
      editComment: "",
    };
  },
  created() {
    this.getToken();
    this.getProjects();
    this.getCategories();
    this.getTasks();
    this.getComments();
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
      const res = await fetch(
        `http://localhost:8000/wp-json/wp/v2/categories/${this.id}/?per_page=99`
      );
      const data = await res.json();

      let projectObj = {};
      projectObj.id = data.id;
      projectObj.name = data.name;
      projectObj.parent = data.parent;
      this.projects.push(projectObj);
    },

    //edit project//
    async editProjectName(editProject, id) {
      let projectName = editProject.name;

      const res = await fetch(
        `http://localhost:8000/wp-json/wp/v2/categories/${id}`
      );
      const data = await res.json();
      data.name = projectName;
      await fetch(`http://localhost:8000/wp-json/wp/v2/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${this.tokens.token}`,
        },
        body: JSON.stringify(data),
      });
      this.projects = this.projects.map((project) =>
        project.id === id ? { ...project, name: editProject.name } : project
      );
    },

    //delete a project //
    async deleteProject(id) {
      const response = await fetch(
        `http://localhost:8000/wp-json/wp/v2/categories/${id}?force=true`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.tokens.token}`,
          },
        }
      );
      if (response.status === 200) {
        this.projects = this.projects.filter((project) => project.id !== id);
        this.$router.push("/");
      }
    },
    // CRUD CHILD CATEGORIES = CATEGORIES

    //get categories//
    async getCategories() {
      const res = await fetch("http://localhost:8000/wp-json/wp/v2/categories/?per_page=99");
      const data = await res.json();

      let catArr = [];

      for (let i = 0; i < data.length; i++) {
        if (data[i].parent == this.id) {
          catArr.push(data[i].id);
        }
      }
      for (let i = 0; i < catArr.length; i++) {
        const res2 = await fetch(
          "http://localhost:8000/wp-json/wp/v2/categories/" + catArr[i]
        );
        const data2 = await res2.json();
        let catObj = [];
        catObj.categoryId = data2.id;
        catObj.name = data2.name;
        catObj.parent = data2.parent;
        this.categories.push(catObj);
      }
    },

    //create category

    async addCat(newCat) {
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

    //edit categories//
    async editCategoryName(editCat, id) {
      let categoryName = editCat.name;

      const res = await fetch(
        `http://localhost:8000/wp-json/wp/v2/categories/${id}`
      );
      const data = await res.json();
      data.name = categoryName;
      await fetch(`http://localhost:8000/wp-json/wp/v2/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${this.tokens.token}`,
        },
        body: JSON.stringify(data),
      });

      this.categories = this.categories.map((cat) =>
        cat.categoryId === id ? { ...cat, name: editCat.name } : cat
      );

      this.editCategory = "";
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
      if (response.status === 200) {
        this.categories = this.categories.filter(
          (category) => category.categoryId !== id
        );
      }
    },

    //CRUD POSTS//

    //get Posts

    async getTasks() {
      try {
        const res = await fetch("http://localhost:8000/wp-json/wp/v2/posts");
        const data = await res.json();

        // await this.getCategories();
        // let catId = [];
        // // category.categoryId == post.categories
        // this.categories.forEach((cat) => {
        //   catId.push(cat.categoryId);
        // });

        // let postCat = [];
        // let merged = [];
        // let ids = [];
        // for (let i = 0; i < data.length; i++) {
        //   postCat.push(data[i].categories);
        //   merged = [].concat.apply([], postCat);
        // }
        // for (let j = 0; j < merged.length; j++) {
        //   if (catId.includes(merged[j])) {
        //     ids.push(data[j].id);
        //   }
        // }

        // for (let k = 0; k < ids.length; k++) {
        //   const res2 = await fetch(
        //     "http://localhost:8000/wp-json/wp/v2/posts/" + ids[k]
        //   );
        await data.forEach((data2) => {
          console.log(data2);
          let postObj = {};
          postObj.id = data2.id;
          postObj.title = data2.title.rendered;
          postObj.content = this.cleanTags(data2.content.rendered);
          postObj.date = data2.date;
          postObj.status = data2.status;
          postObj.categories = data2.categories;
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

        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },

    //edit a post//

    async editPostName(editTask, id) {
      let postName = editTask.title;

      const res = await fetch(
        `http://localhost:8000/wp-json/wp/v2/posts/${id}`
      );
      const data = await res.json();
      data.title = postName;
      await fetch(`http://localhost:8000/wp-json/wp/v2/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${this.tokens.token}`,
        },
        body: JSON.stringify(data),
      });

      this.posts = this.posts.map((post) =>
        post.id === id ? { ...post, title: editTask.title } : post
      );

      this.editPost = "";
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
    async addComment(newComment) {
      try {
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
      } catch (err) {
        console.log(err.message);
      }
    },

    //EDIT A COMMENT//
    async editCommentName(id) {
      let commentContent = this.editComment;

      try {
        const res = await fetch(
          `http://localhost:8000/wp-json/wp/v2/comments/${id}`
        );
        const data = await res.json();

        data.content.rendered = commentContent;

        await fetch(`http://localhost:8000/wp-json/wp/v2/comments/${id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${this.tokens.token}`,
          },
          body: JSON.stringify(data),
        });

        this.comments = this.comments.map((comment) =>
          comment.id === id ? { ...comment, title: this.editComment } : comment
        );

        this.editComment = "";
      } catch (err) {
        console.log(err);
      }
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

.project {
  border: 2px black solid;
  margin: 20px 20px 50px 20px;
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