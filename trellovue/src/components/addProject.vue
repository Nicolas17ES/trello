<template>
  <div class="one">
    <form @submit="onSubmit" class="add-form">
      <div class="form-control">
        <input
          type="project"
          v-model="project"
          name="project"
          :placeholder="[this.id ? 'Edit Project' : 'Enter a name...']"
        />
      </div>
      <input
        type="submit"
        :value="[this.id ? 'Edit Project' : 'Create new project']"
        class="submit"
      />
    </form>
  </div>
  <!-- form -->
</template>

<script>
export default {
  name: "addProject",
  props: {
    id: Number,
  },
  data() {
    return {
      project: "",
    };
  },

  methods: {
    //submit form
    async onSubmit(e) {
      e.preventDefault();
      if (!this.project) {
        alert("Please add a project");
      }

      const newProject = {
        name: this.project,
        parent: 0,
      };
      const editProject = {
        name: this.project,
      };

      this.$emit("add-project", newProject);
      this.$emit("edit-project", editProject, this.id);

      this.project = "";
    },
  },
};
</script>

<style scoped>
.form-control input {
  border-radius: 6px;
  background: rgba(225, 252, 237, 0.5);

  width: 20%;
  height: 40px;
  margin: 70px 2px 5px 2px;
  padding: 3px 7px;
  font-size: 20px;
  border: none;
}
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: rgba(95, 126, 107, 0.8);
  
  opacity: 1; /* Firefox */
  font-weight: bold;
}

.submit {
  border-radius: 6px;
  background: rgb(225, 252, 237);
  color: rgb(95, 126, 107);
  width: 12%;
  height: 27px;
  margin-top: 10px;
  padding: 3px 7px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
</style>