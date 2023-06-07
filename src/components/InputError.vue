<template>
  <small v-for="$error in prop?.$errors" :key="$error.$uid" class="input-error">{{ $error.$message }}<br/></small>
  <small v-for="key in Object.keys(error?.constraints ?? {})" :key="key + error?.property" class="input-error">{{
      error.constraints[key]
    }}<br/></small>
</template>

<script lang="ts" setup>
import { ValidationError } from '@/services/api/errors';

defineProps<{
  prop?: { $errors: Array<{ $uid: string, $message: string }> },
  error?: ValidationError
}>()

</script>


<style scoped>
.input-error {
  color: #eb445a;
}

</style>
