import { ChevronDoubleUpIcon, ChevronUpIcon, PhotoIcon } from '@heroicons/react/24/solid';

const HomeNFTSale: React.FC = () => {
  return (
    <section className="relative flex rounded-2xl bg-[#161418] p-2 shadow-2xl md:w-1/4 md:p-4">
      <PhotoIcon className="sectionPhotoIcon" />
      <div className="flex w-[65%] flex-col pb-5 md:w-[70%]">
        <div className="pt-12 text-[50px] font-bold leading-none tracking-[0.08em]">
          128{/* Coin price */}
          <span className="text-[24px] font-normal md:text-[30px]">₳</span>
          <p className="p-2 text-[14px] font-[400] leading-5 tracking-wider md:text-[1rem]">
            Average NFT sale price
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        <ChevronUpIcon className="sectionArrowDownIcon" />
        <ChevronDoubleUpIcon className="sectionLeftArrowIcon" />
        {/*<span className="absolute right-14 bottom-1/4 text-[18px] text-[#FF4A4A]">
      0,96% 
    </span>*/}
        {/* Percentage variable */}
      </div>
    </section>
  );
};

export default HomeNFTSale;
