<template>
  <div class="one">
    <form @submit.prevent="onSubmit" class="add-form">
      <div class="form-control">
        <input
          type="content"
          v-model="commentContent"
          name="content"
          placeholder="Add Comment to the Post"
        />
      </div>
      <input type="submit" value="Add comment" class="btn btn-block button3" />
    </form>
  </div>
  <!-- form -->
</template>

<script>
export default {
  name: "addComment",
  props: {
    post: Number,
    tokens: Object,
  },
  data() {
    return {
      commentContent: "",
      postId: this.post,
    };
  },

  methods: {
    //submit form
    async onSubmit(e) {
      e.preventDefault();
      if (!this.commentContent) {
        alert("Please add a comment");
      }
      const newComment = {
        post: this.post,
        author_name: this.tokens.user_nicename,
        author_email: this.tokens.user_email,
        content: this.commentContent,
        status: "approved",
      };

      this.$emit("add-comment", newComment);

      this.commentContent = "";
    },
  },
};
</script>