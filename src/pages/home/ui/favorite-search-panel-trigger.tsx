import { BottomSheet, Input } from "@/shared/ui";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { useDistrictSearch } from "../lib/use-district-search";
import { type District } from "../model/district";

type FavoriteSearchPanelTriggerProps = {
  className?: string;
  onSelectDistrict: (district: District) => void;
};

export function FavoriteSearchPanelTrigger({
  className,
  onSelectDistrict,
}: FavoriteSearchPanelTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { query, setQuery, searchResults } = useDistrictSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  return (
    <>
      <Input
        className={className}
        variant="search"
        placeholder="장소 검색"
        readOnly
        onClick={handleTriggerClick}
      />

      <BottomSheet
        className="data-[vaul-drawer-direction=bottom]:h-[90vh] data-[vaul-drawer-direction=bottom]:max-h-[90vh]"
        isOpen={isOpen}
        title="장소 검색"
        onClose={handleSheetClose}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-md">
          <Input
            ref={inputRef}
            variant="search"
            placeholder="장소 검색"
            value={query}
            onChange={handleQueryChange}
          />

          {query.trim().length > 0 && (
            <div className="min-h-0 overflow-auto rounded-lg border border-hairline bg-canvas">
              {searchResults.length > 0 ? (
                searchResults.map((district) => (
                  <button
                    key={district.name}
                    className="flex w-full items-center px-md py-sm text-left text-body-sm text-ink transition-colors hover:bg-surface-soft"
                    type="button"
                    onClick={() => handleSelectResult(district)}
                  >
                    <span className="min-w-0 truncate">{district.name}</span>
                  </button>
                ))
              ) : (
                <p className="px-md py-sm text-body-sm text-meta">
                  해당 장소의 정보가 제공되지 않습니다.
                </p>
              )}
            </div>
          )}
        </div>
      </BottomSheet>
    </>
  );

  function handleTriggerClick() {
    setIsOpen(true);
  }

  function handleSheetClose() {
    setIsOpen(false);
  }

  function handleQueryChange(event: SyntheticEvent<HTMLInputElement>) {
    setQuery(event.currentTarget.value);
  }

  function handleSelectResult(district: District) {
    onSelectDistrict(district);
    setQuery("");
    setIsOpen(false);
  }
}
