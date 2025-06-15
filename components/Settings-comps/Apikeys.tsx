export default function APIKeysCard() {
  return (
    <section className="">
      <h2 className="text-xl font-bold text-[#77347c] dark:text-white mb-1">
        API Keys
      </h2>
      <p className="text-sm text-[#9e528c] dark:text-[#d8a5cc] mb-6">
        Bring your own API keys for select models.
      </p>

      <div className="rounded-lg border border-[#e6b0d4]  dark:bg-[#1f131b] dark:bg-none dark:border-[#7b2c4f] bg-gradient-to-b from-[#f4ccee] via-[#f4d5f0] to-[#f1e1f4]  p-6 text-center">
        <h3 className="text-lg font-semibold text-[#77347c] dark:text-white mb-2">
          Pro Feature
        </h3>
        <p className="text-sm text-[#a74576] dark:text-[#eab4cf] mb-4">
          Upgrade to Pro to access this feature.
        </p>
        <button className="bg-[#a74576] hover:bg-[#8e3c65] text-white px-4 py-2 rounded-md text-sm shadow-md transition cursor-pointer">
          Upgrade to Pro - $8/month
        </button>
      </div>
    </section>
  );
}
