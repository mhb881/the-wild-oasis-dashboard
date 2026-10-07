import CabinTable from "../features/cabins/CabinTable";
import CabinTableOperations from "../features/cabins/CabinTableOperations";
import { Heading, RowLayout } from "../ui";

function Cabins() {
  return (
    <>
      <RowLayout type="horizontal">
        <Heading type={"h1"}>所有房间</Heading>
        <CabinTableOperations />
      </RowLayout>

      <section className="flex w-full flex-col">
        <CabinTable />
      </section>
    </>
  );
}

export default Cabins;
