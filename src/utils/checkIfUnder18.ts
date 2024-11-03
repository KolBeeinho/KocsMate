export default function checkIfUnderEightTeen(
  date_of_birth: Date | string
): boolean | null {
  try {
    let birthday: Date;

    if (typeof date_of_birth === "string") {
      birthday = new Date(date_of_birth);
    } else {
      birthday = date_of_birth;
    }
    if (!(birthday instanceof Date) || isNaN(birthday.getTime())) {
      throw new Error("Érvénytelen dátum.");
    }

    birthday.setHours(0, 0, 0, 0);
    const currentDate = new Date(Date.now());
    const today = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
      0
    );

    const eighteenYearsInMilliseconds = 18 * 365 * 24 * 60 * 60 * 1000;

    return birthday.getTime() > today.getTime() - eighteenYearsInMilliseconds; //TODO hibakezelés érvénytelen születési dátumra, és átállni UTC+2-re, de 1901-től
  } catch (error) {
    console.log("Hiba történt az életkor megállapítása során: ", error);
    return null;
  }
}
