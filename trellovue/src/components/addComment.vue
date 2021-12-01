<template>
  <div class="one">
    <form @submit="onSubmit" class="add-form">
      <div class="form-control">
        <input
          type="content"
          v-model="commentContent"
          name="content"
          :placeholder="[this.id ? 'Edit Comment' : 'Add Comment']"
        />
      </div>
      <input
        type="submit"
        :value="[this.id ? 'Edit Comment' : 'Add Comment']"
        class="btn btn-block button3"
      />
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
    id: Number,
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

      const editComment = {
        content: this.commentContent,
        author: "1",
      };

      const newComment = {
        post: this.post,
        author_name: this.tokens.user_nicename,
        author_email: this.tokens.user_email,
        content: this.commentContent,
        status: "approved",
      };

      this.$emit("add-comment", newComment);

      this.$emit("edit-comment", editComment, this.id);

      this.commentContent = "";
    },
  },
};
</script>