<template>
  <small v-for="error in prop.$errors" :key="error.$uid" class="input-error">{{ error.$message }}<br/></small>
</template>

<script lang="ts" setup>
defineProps<{ prop: { $errors: Array<{ $uid: string, $message: string }> } }>()
</script>


<style scoped>
.input-error {
  color: #eb445a;
}

</style>
