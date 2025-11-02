<script setup>
import HorseIcon from "../assets/icons/horse.svg?component";
import StartIcon from "../assets/icons/start.svg?component";
import PauseIcon from "../assets/icons/pause.svg?component";
import ResumeIcon from "../assets/icons/resume.svg?component";
import ProgramIcon from "../assets/icons/program.svg?component";
import ResetIcon from "../assets/icons/reset.svg?component";
import TrophyIcon from "../assets/icons/trophy.svg?component";

const icons = {
  horse: HorseIcon,
  start: StartIcon,
  pause: PauseIcon,
  resume: ResumeIcon,
  program: ProgramIcon,
  reset: ResetIcon,
  trophy: TrophyIcon,
};

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 28 },
  color: { type: String, default: "currentColor" },
});
</script>

<template>
  <component
    :is="icons[name]"
    v-bind="{ width: size, height: size, fill: color }"
  />
</template>

<style scoped>
svg {
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
}
:deep(svg path),
:deep(svg circle),
:deep(svg rect),
:deep(svg polygon) {
  fill: currentColor !important;
}
</style>
