export default function pubStates(state: string) {
  switch (state) {
    case "func":
      return "Üzemel";
    case "t_closed":
      return "Átmenetileg zárva";
    case "closed":
      return "Végleg bezárt";
    default:
      return "Ismeretlen állapot";
  }
}
