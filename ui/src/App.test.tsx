import set_meeting from './services/request_zoom';

test('create a zoom meeting',async () => {
  const duration = 60;
  let start_date = new Date();
  const client = "test";
  const response = await set_meeting(client, start_date, duration);
  expect(response.status).toBe(200);
});