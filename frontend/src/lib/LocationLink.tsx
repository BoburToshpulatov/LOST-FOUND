import { useEffect, useState } from "react";

function useUserLocation() {
  const [locationLink, setLocationLink] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationLink(
          `https://www.google.com/maps?q=${latitude},${longitude}`
        );
      },
      (err) => {
        console.error("Location access denied or failed", err);
        setLocationLink(null);
      }
    );
  }, []);

  return locationLink;
}

export default useUserLocation;
