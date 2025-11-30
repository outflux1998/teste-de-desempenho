import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  
    { duration: '2m', target: 50 },  
    { duration: '30s', target: 0 },  
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],      
    http_req_duration: ['p(95)<500'],    
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    items: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 2 },
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

  sleep(1);
}
