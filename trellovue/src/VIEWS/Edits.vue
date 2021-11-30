<template>
  <h1>WELCOME TO TRELLO</h1>
  <router-link to="/tasks">View your project</router-link>
  <div v-for="(project, index) in projects" :key="index" class="project">
    <button
      title="Click to see more"
      class="fas fa-plus"
      id="azul"
      @click="
        $router.push({
          name: 'Project',
          params: { id: project.id },
        })
      "
    >
      {{ project.name }}
    </button>
  </div>

  <p>l</p>
  <p>l</p>
  <p>l</p>
  <p>l</p>
  <p>l</p>
  <p>l</p>
  <p>l</p>
  <!-- create a project -->
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
</template>

<script>
export default {
  data() {
    return {
      projects: [],
      tokens: [],
      project: "",
    };
  },

  created() {
    this.getToken();
    this.getProjects();
  },

  methods: {
    //take tags out//
    // cleanTags(value) {
    //   return value.replace(/<\/?[^>]+(>|$)/g, "");
    // },

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
  },
};
</script>