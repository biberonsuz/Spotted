import Button from "../ui/primitives/Button";

type MarketingLandingViewProps = {
  onLoginClick: () => void;
  onRegisterClick: () => void;
};

export default function MarketingLandingView({
  onLoginClick,
  onRegisterClick,
}: MarketingLandingViewProps) {
  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-hidden bg-white">
      <header className="w-full border-b border-gray-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <div className="text-2xl font-medium">
            Spotted<span className="tracking-[-0.15em]">●●</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onRegisterClick}
              className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm hover:border-blue-600 hover:text-blue-700"
            >
              Register
            </Button>
            <Button
              onClick={onLoginClick}
              className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm hover:border-blue-600 hover:text-blue-700"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
              Find the best vintage shops in your neighbourhood.
            </h1>
            <p className="max-w-xl text-sm text-gray-600 md:text-base">
              Spotted helps you discover second-hand gems across London. See
              curated maps of neighbourhoods, track shops you&apos;ve visited,
              and share your best finds with friends. And its all for free!
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={onRegisterClick}
                className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-800"
              >
                Get started for free
              </Button>
              <button
                type="button"
                onClick={onLoginClick}
                className="text-sm font-medium text-gray-700 underline decoration-dotted underline-offset-2 hover:text-blue-700"
              >
                I already have an account
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Currently available in London. More cities coming soon.
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <div className="relative mx-auto max-w-72 shrink-0 overflow-hidden bg-white">
              <img
                src="/app-preview.png"
                alt="Spotted app showing a map of London with a shop detail card for Rokit Brick Lane"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="min-w-0 rounded-xl border border-gray-200 p-4">
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Explore a map of trusted vintage & charity shops.</p>
                <p>• Save places you&apos;ve visited and see friends&apos; visited places.</p>
                <p>• Build a feed of your favourite second-hand finds.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

