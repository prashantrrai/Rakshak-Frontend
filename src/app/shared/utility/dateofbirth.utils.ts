export class DateOfBirthUtils {
    /**
     * Converts a Date | string to YYYY-MM-DD string format
     */
    static toDateString(date: Date | string | null | undefined): string | null {
        if (!date) return null;

        const dob = new Date(date);
        if (isNaN(dob.getTime())) return null; // invalid date check

        const year = dob.getFullYear();
        const month = (dob.getMonth() + 1).toString().padStart(2, '0');
        const day = dob.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`; // ✅ e.g. "2001-05-02"
    }
}
