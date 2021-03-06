import axios from './util/axios';

export async function getDrawing(id) {
  try {
    const res = await axios.get(`/api/drawing/${id}`);
    if (!res || !res.data || !res.data.success) throw new Error('Failed to download drawing');
    return res.data.drawData;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function postContactMessage(body) {
  try {
    const res = await axios.post('/api/contact-messages', body);
    return res.data && res.data.success;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getPublicGame() {
  try {
    const res = await axios.get('/api/games/public');
    if (res.data && res.data.success) {
      return res.data.game;
    }
    throw new Error('Failed to get public game');
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default getDrawing;
