import { Link } from "react-router";

import type { ItemOfGetStaysTodayActivity } from "~/types/types";
import { Button, Flag, Tag } from "~/ui";

import CheckoutButton from "./CheckOutButton";

interface TodayItemProps {
  activity: ItemOfGetStaysTodayActivity;
}

function TodayItem({ activity }: TodayItemProps) {
  const { id, status, guests, numNights } = activity;

  return (
    <li className="grid grid-cols-[9rem_2rem_1fr_7rem_9rem] items-center gap-3 border-b border-gray-100 py-2.5 text-sm first:border-t dark:border-gray-800">
      <div className="text-center">
        {status === "unconfirmed" && <Tag type="green">待入住</Tag>}
        {status === "checked-in" && <Tag type="blue">待退房</Tag>}
      </div>

      <Flag
        src={guests.countryFlag}
        alt={guests.nationality ? `Flag of ${guests.nationality}` : "国旗"}
      />
      <div className="truncate font-medium text-gray-800 dark:text-gray-200">
        {guests.fullName}
      </div>
      <div className="text-gray-500 dark:text-gray-400">{numNights} 晚</div>

      {status === "unconfirmed" && (
        <Link to={`/checkin/${id}`} className="w-full">
          <Button variant="primary" size="sm" className="w-full">
            办理入住
          </Button>
        </Link>
      )}
      {status === "checked-in" && <CheckoutButton bookingId={id!} />}
    </li>
  );
}

export default TodayItem;
