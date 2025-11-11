import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

interface ValidateCouponResponse {
  valid: boolean;
  coupon?: {
    id: string;
    code: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
  };
  discount?: number;
  finalValue?: number;
  message: string;
}

export const validateCoupon = async (code: string, cartValue: number): Promise<ValidateCouponResponse> => {
  const response = await axios.post(`${API_URL}/coupons/validate`, {
    code,
    cartValue
  });
  return response.data;
};
