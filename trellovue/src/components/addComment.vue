<template>
  <form @submit="addComment(e)" class="add-form">
    <div class="form-control">
      <input
        type="comment"
        v-model="content"
        name="comment"
        placeholder="Add Comment"
      />
    </div>
    <input type="submit" value="Add comment" class="btn btn-block button3" />
  </form>
</template>


<script>
export default {
  name: "addComment",
  props: {},
  data() {
    return {
      content: "",
    };
  },

  methods: {
    //submit form
    async addComment(e) {
      e.preventDefault();
      if (!this.comment) {
        alert("Please add a comment");
      }

      const newComment = {
        post: id,
        author_name: this.tokens.user_nicename,
        author_email: this.tokens.user_email,
        content: this.tokens.content,
      };
      console.log(newComment);
    },
  },
};
</script>