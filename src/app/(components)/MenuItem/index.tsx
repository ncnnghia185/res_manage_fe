"use client";
import React from "react";

type Props = {
  language: string;
  accessToken: string;
  owner_id: number;
  restaurant_id: number;
  menu_item_id: number;
};

const MenuItem = ({
  language,
  accessToken,
  owner_id,
  restaurant_id,
  menu_item_id,
}: Props) => {
  return <div>MenuItem</div>;
};

export default MenuItem;
