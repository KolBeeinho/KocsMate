import { ChevronDoubleUpIcon, ChevronUpIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

const HomeJFWInfos: React.FC = () => {
  return (
    <section className="relative flex rounded-2xl bg-[#161418] p-2 shadow-2xl md:p-4">
      <CurrencyDollarIcon className="sectionHomeDollarIcon" />
      <div className="flex w-[65%] flex-col md:w-[70%]">
        <div className="pt-12 text-[50px] font-bold leading-none tracking-[0.08em]">
          1,23{/* Coin price */}
          <span className="text-[24px] font-normal md:text-[30px]">₳</span>
          <p className="p-2 text-[14px] font-[400] leading-5 tracking-wide md:text-[1rem]">
            Current JFW Coin price, and change in the last 24 hours
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        <ChevronUpIcon className="sectionArrowUpIcon" />
        <ChevronDoubleUpIcon className="sectionLeftArrowIcon" />
        {/*<span className="absolute bottom-1/4 right-12 text-[18px] text-[#46BD4C]">
      4,12%
    </span>*/}
        {/* Percentage variable */}
      </div>
    </section>
  );
};

export default HomeJFWInfos;
