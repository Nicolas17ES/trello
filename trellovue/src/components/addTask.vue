<template>
  <div class="one">
    
    <form @submit="onSubmit" class="add-form">
      <div class="form-control">
        
        <input
          type="title"
          v-model="title"
          name="title"
          :placeholder="[this.id ? 'Edit Task' : 'Add Task']"
        />
      </div>
      <input type="submit" :value="[this.id ? 'Edit Task' : 'Add Task']" class="btn btn-block button3" />
    </form>
  </div>
  <!-- form -->
</template>

<script>
export default {
  name: "addTask",
  props: {
    category: Number,
    id: Number,
  },
  data() {
    return {
      title: "",
      content: "",
      status: "publish",
      categories: this.category,
    };
  },

  methods: {
    //submit form
    async onSubmit(e) {
      e.preventDefault();
      if (!this.title) {
        alert("Please add a title");
      }

      const newTask = {
        title: this.title,
        content: this.title,
        status: this.status,
        categories: this.category,
      };

      const editTask = {
        title: this.title,
      };

      this.$emit("add-task", newTask);
      this.$emit("edit-task", editTask, this.id);

      this.title = "";
      this.content = "";
    },
  },
};
</script>


