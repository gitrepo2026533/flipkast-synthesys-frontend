import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getPrefilled } from "../../redux/reducers/popupsReducer";
import Modal from "../Modal/Modal";
import ProductCard from "../ProductCard/ProductCard";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateNewProjectPopup = ({ open, onClose }: Props) => {
  const [products, setProducts] = useState<any[]>();
  const prefilled = useSelector(getPrefilled);

  useEffect(() => {
    const newProducts = prefilled.map((prefill: any) => ({
      title: prefill.title,
      description: prefill.description,
      image: prefill.image,
      link: prefill.link,
    }));

    setProducts(newProducts);
  }, [prefilled]);

  return (
    <Modal className="create-new-project" title="Create new project" open={open} onClose={onClose}>
      <ProductWrapper>
        {products?.map((product) => (
          <ProductCard
            key={product.title}
            image={product.image}
            title={product.title}
            description={product.description}
            link={product.link}
            onClose={onClose}
          />
        ))}
      </ProductWrapper>
    </Modal>
  );
};

const ProductWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-flow: row wrap;
  margin-top: 16px;
  row-gap: 12px;
  column-gap: 12px;

  & > div {
    width: 200px;
    max-height: 150px;
    min-height: auto;

    & > img {
      min-height: 150px;
      max-height: 150px;
      max-width: inherit;
    }

    :nth-child(4),
    :nth-child(5) {
      flex-grow: 2;

      & > img {
        max-width: inherit;
      }
    }

    :after {
      background: ${({ theme }) => theme.mainCardPopupBackground};
    }

    & > .text-with-actions {
      top: auto;
      left: auto;
      bottom: 16px;
      right: 16px;
    }

    & > .button-wrapper {
      right: 16px;
    }

    & > div > div {
      span:first-child {
        font-size: 14px;
      }

      span:last-child {
        font-size: 12px;
      }
    }

    @media (max-width: 1001px) {
      max-height: 120px;

      & > img {
        min-height: 120px;
        max-height: 120px;
      }
    }

    @media (max-width: 756px) {
      width: calc((100% - 12px) / 2);

      & > img {
        max-width: inherit;
      }

      :nth-child(4),
      :nth-child(5) {
        & > img {
          max-width: inherit;
        }
      }
    }

    @media (max-width: 500px) {
      width: 100%;
    }
  }
`;

export default CreateNewProjectPopup;
