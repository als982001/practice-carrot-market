export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;

  const time = new Date(date).getTime();
  const now = new Date().getTime();

  const diff = Math.round(time - now / dayInMs);

  const formatter = new Intl.RelativeTimeFormat("ko");

  return formatter.format(diff, "days");
}

export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}

const IMAGE_SIZE_LIMIT = 5_242_880;

export const checkValidImage = (file: File) => {
  const { size, type } = file;

  if (!type.startsWith("image/")) {
    alert("이미지가 아님");
    return false;
  }

  if (size > IMAGE_SIZE_LIMIT) {
    alert("이미지가 5MB보다 크네요");
    return false;
  }

  return true;
};
