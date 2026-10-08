import { Button } from "~/ui";

import { useCheckout } from "./useCheckout";

interface CheckoutButtonProps {
  bookingId: number;
}

export function CheckoutButton({ bookingId }: CheckoutButtonProps) {
  const { checkout, isCheckingOut } = useCheckout();

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={() => checkout(bookingId)}
      disabled={isCheckingOut}
    >
      办理退房
    </Button>
  );
}

export default CheckoutButton;
