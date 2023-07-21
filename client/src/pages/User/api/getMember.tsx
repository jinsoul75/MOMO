import axios from 'axios';

export default async function getMember(url: string, token: string) {
    const headers = {
      'ngrok-skip-browser-warning': '69420',
      Authorization: `${token}`,
    };

    const res = await axios.get(url, { headers });

    console.log(res);

    return res.data;
}
