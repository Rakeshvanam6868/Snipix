import { BentoGridDemo } from "./BentoGridDemo";

export default function SnipixOffers() {
  return (
    <>
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
        
          <h2
            // style={{ textShadow: "0px 0px 10px #006BCB" }}
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-50"
          >
            Snipix Offers
          </h2>
          <p className="mx-auto max-w-[700px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"></p>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"></div>
      <div className="">
        <BentoGridDemo />
      </div>
    </>
  );
}
