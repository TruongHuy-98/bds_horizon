import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ban-dat")({
  beforeLoad: () => {
    throw redirect({
      to: "/nha-dat-ban",
      replace: true,
    });
  },
});
