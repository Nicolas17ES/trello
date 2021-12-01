<template>
  <div class="one">
    <form @submit.prevent="onSubmit" class="add-form">
      <div class="form-control">
        <input
          type="category"
          v-model="category"
          name="category"
          :placeholder="[this.id ? 'Edit Category' : 'Add Category']"
        />
      </div>
      <input
        type="submit"
        :value="[this.id ? 'Edit Category' : 'Add Category']"
        class="btn btn-block button3"
      />
    </form>
  </div>
  <!-- form -->
</template>

<script>
export default {
  name: "addCat",
  props: {
    project: Number,
    id: Number,
  },
  data() {
    return {
      category: "",
      parent: this.project,
      description: "category",
    };
  },

  methods: {
    //submit form
    async onSubmit(e) {
      console.log(this.id);
      e.preventDefault();
      if (!this.category) {
        alert("Please add a category");
      }

      const newCat = {
        name: this.category,
        parent: this.project,
      };
      const editCat = {
        name: this.category,
      };

      this.$emit("add-category", newCat);
      this.$emit("edit-category", editCat, this.id);

      this.category = "";
    },
  },
};
</script>