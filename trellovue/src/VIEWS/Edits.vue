<template>
  <div class="homeView">
    <h1>WELCOME TO TRELLO</h1>
    <h3>View your projects</h3>
    <div class="projectList">
      <div v-for="(project, index) in projects" :key="index" class="project">
        <button
          title="Click to see more"
          class="button instagram"
          id="azul"
          @click="
            $router.push({
              name: 'Project',
              params: { id: project.id },
            })
          "
        >
          <span class="gradient"></span> {{ project.name }}
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

<style scoped>
h1 {
  margin-top: 90px;
  font-size: 3rem;
}

h3 {
  margin-top: 115px;
  font-size: 1.9rem;
}

.projectList {
  display: flex;
  justify-content: center;
  align-content: center;
}

.project {
  margin-right: 50px;
}
.create {
  margin-top: 100px;
}

.button {
  display: block;
  width: 130px;
  max-width: 100%;
  margin: 35px auto;
  margin-bottom: 0;
  overflow: hidden;
  position: relative;
  transform: translatez(0);
  text-decoration: none;
  box-sizing: border-box;
  font-size: 15px;
  font-weight: bold;
  box-shadow: 0 9px 18px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  border: none;
}

.instagram {
  text-align: center;
  border-radius: 50px;
  padding: 10px;
  color: rgba(40, 146, 81);
  background: rgba(230, 255, 241, 0.5);
  transition: all 2s ease-out 0s;
}

.gradient {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  bottom: auto;
  margin: auto;
  z-index: -1;
  background: radial-gradient(
    90px circle at top center,
    rgba(146, 247, 205, 0.9) 30%,
    rgba(116, 255, 197, 0)
  );
  transition: all 0s ease-out 0s;
  transform: translatex(-140px);
  animation: 18s linear 0s infinite move;
}

@keyframes move {
  0% {
    transform: translatex(-140px);
  }
  25% {
    transform: translatex(140px);
    opacity: 0.3;
  }
  50% {
    transform: translatex(140px);
    opacity: 1;
    background: radial-gradient(
      90px circle at bottom center,
      rgba(146, 247, 205, 0.9) 30%,
      rgba(116, 255, 197, 0)
    );
  }
  75% {
    transform: translatex(-140px);
    opacity: 0.3;
  }
  100% {
    opacity: 1;
    transform: translatex(-140px);
    background: radial-gradient(
      90px circle at top center,
      rgba(146, 247, 205, 0.9) 30%,
      rgba(116, 255, 197, 0)
    );
  }
}
</style>