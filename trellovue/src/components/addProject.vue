<template>
  <div class="one">
    <form @submit="onSubmit" class="add-form">
      <div class="form-control">
        <input
          type="project"
          v-model="project"
          name="project"
          :placeholder="[this.id ? 'Edit Project' : 'Add Project']"
        />
      </div>
      <input type="submit" :value="[this.id ? 'Edit Project' : 'Add Project']" class="btn btn-block button3" />
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