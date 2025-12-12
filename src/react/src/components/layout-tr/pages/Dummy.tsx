export const DummyPage = () => {
  return (
    <main className={"pt-18  p-6 pl-[72px]"}>
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="w-full h-[500px] bg-black rounded-xl">
          {/* Your video player here */}
        </div>

        <div className="bg-muted/20 rounded-xl p-6 h-[1500px]">
          <p>Scroll here — sidebar and header remain fixed.</p>
          <p>Matches YouTube Watch Page behavior.</p>
        </div>
      </div>
    </main>
  );
};
