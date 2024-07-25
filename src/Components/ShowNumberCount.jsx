
const ShowNumberCount = ({ listData=0 }) => {
    const count = listData?.data?.length;
  return (
    <div className="flex items-center justify-center bg-gray-100 ml-10 my-3 rounded-3xl p-3 w-1/3 shadow-md">
      <div className="text-center">
        <p className="text-xl font-semibold font-mono text-gray-800">{`Available Laptops: ${count}`}</p>
      </div>
    </div>
  );
};

export default ShowNumberCount;