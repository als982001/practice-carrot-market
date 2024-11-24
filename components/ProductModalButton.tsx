import { useState } from "react";
import ProductModal from "./ProductModal";

interface IProps {
  id: number;
}

export default function ProductModalButton({ id }: IProps) {
  const [showModal, setShowModal] = useState(false);

  const handleShoWModal = (e: React.MouseEvent) => {
    e.preventDefault();

    setShowModal((prev) => !prev);
  };

  return (
    <>
      <button onClick={handleShoWModal}>요약해서 보기</button>
      {showModal && (
        <>
          <ProductModal id={id} handleShoWModal={handleShoWModal} />
        </>
      )}
    </>
  );
}
