import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // carga baixa
    { duration: '10s', target: 300 },  // salto para 300 (spike)
    { duration: '1m', target: 300 },   // mantém pico
    { duration: '10s', target: 10 },   // queda brusca
    { duration: '30s', target: 10 },   // estabiliza de novo em baixa
  ],
  thresholds: {
    // aqui você pode reaproveitar o SLA do load test, se quiser
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    items: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 1 },
    ],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/checkout/simple`, payload, params);

  check(res, {
    'status é 200 ou 201': (r) => r.status === 200 || r.status === 201,
  });

  sleep(0.5);
}
