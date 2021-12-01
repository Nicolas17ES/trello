<template>
  <div class="homeView">
    <h1>WELCOME TO TRELLO</h1>
    <h3>View your projects:</h3>
    <div class="projectList">
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
    </div>

    <!-- create a project -->
    <AddProject @add-project="createProject" class="create" />
  </div>
</template>

<script>
import AddProject from "../components/addProject";

export default {
  components: {
    AddProject,
  },
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
      const res = await fetch(
        "http://localhost:8000/wp-json/wp/v2/categories/?per_page=99"
      );
      const data = await res.json();
      await data.forEach((project) => {
        let projectObj = {};
        projectObj.id = project.id;
        projectObj.name = project.name;
        projectObj.parent = project.parent;

        if (projectObj.parent === 0 && project.id != 1) {
          this.projects.push(projectObj);
        }
      });
    },

    //create a project//
    async createProject(newProject) {
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
      this.$router.push(`/project/${data.id}`);
    },
  },
};
</script>

<style>

.projectList {
  display: flex;
  justify-content: center;
}

.project {
  margin-right: 20px;
}
.create {
  margin-top: 100px;
}
</style>