import axios from 'axios';

export async function getMenu(date: string, mealType?: string, category?: string) {
  const isServer = typeof window === 'undefined';
  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    : '';
  const {data} = await axios.get(`${baseUrl}/api/menu`, {
    params: {date, mealType, category}
  });
  return data;
}

export default getMenu;