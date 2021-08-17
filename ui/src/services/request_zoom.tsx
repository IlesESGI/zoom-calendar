export default function set_meeting(
  client: string,
  start: Date,
  duration: number
) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: `Réunion client avec ${client}`,
      start_time: start,
      duration: duration,
    }),
  };

  let URL = process.env.API_HOST || "localhost";

  return fetch(`http://${URL}:8081/api/meeting/create`, requestOptions);
}
