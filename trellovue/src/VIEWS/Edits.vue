<template>
  <div>
    <h1>edits</h1>
    <h3>Edit project</h3>
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
      <input type="submit" value="Save Task" class="btn btn-block button3" />
    </form>
  </div>
</template>