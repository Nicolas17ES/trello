<template>
  <div class="one">
    <h3>Add Task</h3>
    <form @submit="onSubmit" class="add-form">
      <div class="form-control">
        <label>Title</label>
        <input
          type="title"
          v-model="title"
          name="title"
          placeholder="Add Title"
        />
      </div>
      <!-- <div class="form-control">
        <label>Content</label>
        <input
          type="content"
          v-model="content"
          name="content"
          placeholder="Content"
        />
      </div> -->
      <!-- <div class="form-control">
        <label>Status</label>
        <input
          type="status"
          v-model="status"
          name="staus"
          placeholder="status"
        />
      </div> -->
      <input type="submit" value="Save Task" class="btn btn-block button3" />
    </form>
  </div>
  <!-- form -->
</template>

<script>
export default {
  name: "addTask",
  props: {
    category: Number,
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
        content: this.content,
        status: this.status,
        categories: this.category,
      };
      const newCat = {
       
        status: this.status,
        categories: this.category,
      };

      this.$emit("add-task", newTask);

      this.title = "";
      this.content = "";
      this.status = "";
    },
  },
};
</script>

<style scoped>

.one{
  border: 1px solid black;
}
</style>
