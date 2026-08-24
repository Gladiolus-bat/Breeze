const RoomCard = ({ room, onView }) => {
  const image = room.images?.[0];

  return (
    <div className="bg-neutral rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="h-44 bg-gray-100">
        {image ? (
          <img src={image} alt={room.roomType} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-playfair text-lg text-primary">{room.roomType}</h3>
        <p className="text-sm text-gray-500">
          {room.hotel?.name}
          {room.hotel?.city ? ` · ${room.hotel.city}` : ""}
        </p>
        {room.services?.length > 0 && (
          <p className="text-xs text-gray-500">{room.services.join(" · ")}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold text-primary">
            ${room.pricePerNight}
            <span className="text-xs text-gray-500 font-normal">/night</span>
          </span>
          <button
            onClick={onView}
            className="text-sm bg-primary text-white rounded-lg px-3 py-1.5 hover:opacity-90 transition">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
