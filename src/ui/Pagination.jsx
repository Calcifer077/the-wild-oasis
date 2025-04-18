import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
// import { PAGE_SIZE } from "../utils/constants";

const PAGE_SIZE = Number(import.meta.env.VITE_PAGE_SIZE);

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const P = styled.p`
  font-size: 1.4rem;
  margin-left: 0.8rem;

  & span {
    font-weight: 600;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const PaginationButton = styled.button`
  background-color: ${(props) =>
    props.active ? " var(--color-brand-600)" : "var(--color-grey-50)"};
  color: ${(props) => (props.active ? " var(--color-brand-50)" : "inherit")};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

function Pagination({ count }) {
  // To set and get current page in the url
  const [searchParams, setSearchParams] = useSearchParams();

  // If the url doesn't have any current page, meaning that we have just loaded the application, then set the page to '1' else to the page we are on right now.
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  // Total number of pages
  const pageCount = Math.ceil(count / PAGE_SIZE);

  // To go to next page
  function nextPage() {
    // If we are alredy at the last page then we can't go any further that's why 'next' will remain equal to 'currentPage' else we can increase it by 1.
    const next = currentPage === pageCount ? currentPage : currentPage + 1;

    // Set the updated page to url
    searchParams.set("page", next);
    setSearchParams(searchParams);
  }

  // To go to previous page
  function prevPage() {
    // If we are the first page then we can't go any further back, so set 'prev' to '1' else reduce it by 1.
    const prev = currentPage === 1 ? currentPage : currentPage - 1;

    searchParams.set("page", prev);
    setSearchParams(searchParams);
  }

  // If the total number of pages is less than 1
  if (pageCount <= 1) return null;

  return (
    <StyledPagination>
      <P>
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{" "}
        of <span>{count}</span> results
      </P>

      <Buttons>
        <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
          <HiChevronLeft /> <span>Previous</span>
        </PaginationButton>

        <PaginationButton
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          <span>Next</span>
          <HiChevronRight />
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
}

export default Pagination;
