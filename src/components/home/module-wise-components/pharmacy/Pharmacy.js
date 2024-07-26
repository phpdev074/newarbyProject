import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomContainer from "../../../container";
import Banners from "../../banners";
import BestReviewedItems from "../../best-reviewed-items";
import FeaturedCategories from "../../featured-categories";
import RunningCampaigns from "../../running-campaigns";
import Stores from "../../stores";
import VisitAgain from "../../visit-again";
import FeaturedStores from "./featured-stores";
import PharmacyStaticBanners from "./pharmacy-banners/PharmacyStaticBanners";
import CommonConditions from "./common-conditions";
import useGetOtherBanners from "../../../../api-manage/hooks/react-query/useGetOtherBanners";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import { useSelector } from "react-redux";
import { getToken } from "helper-functions/getToken";
import { getCurrentModuleId } from "helper-functions/getCurrentModuleType";
import { useGetVisitAgain } from "api-manage/hooks/react-query/useGetVisitAgain";
import useGetNewArrivalStores from "api-manage/hooks/react-query/store/useGetNewArrivalStores";
import { getModuleId } from "helper-functions/getModuleId";

const menus = ["All", "New", "Baby Care", "Womans Care", "Mens"];

const Pharmacy = ({ configData }) => {
  const token = getToken();
  const [isVisited, setIsVisited] = useState(false);
  const { orderDetailsModalOpen } = useSelector((state) => state.utilsData);
  const [storeData, setStoreData] = React.useState([]);
  const { data, refetch, isLoading } = useGetOtherBanners();
  const { data: visitedStores, refetch: refetchVisitAgain } =
    useGetVisitAgain();
  const {
    data: newStore,
    refetch: newStoreRefetch,
    isFetching,
  } = useGetNewArrivalStores({
    type: "all",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
        if (token) {
          await refetchVisitAgain();
        }
        newStoreRefetch();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);
  useEffect(() => {
    if (visitedStores?.length > 0 || newStore?.stores?.length > 0) {
      if (visitedStores?.length > 0 && visitedStores) {
        setStoreData(visitedStores);
        setIsVisited(true);
      } else {
        if (newStore?.stores) {
          setStoreData(newStore?.stores);
        }
      }
    }
  }, [visitedStores, newStore?.stores, getModuleId()]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sx={{ marginTop: "10px" }}>
        <CustomContainer>
          <FeaturedCategories configData={configData} />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <PharmacyStaticBanners />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <VisitAgain
            configData={configData}
            visitedStores={storeData}
            isVisited={isVisited}
          />
        </CustomContainer>
      </Grid>

      <Grid item xs={12}>
        <CustomContainer>
          <BestReviewedItems
            menus={menus}
            title="Basic Medicine Nearby"
            bannerIsLoading={isLoading}
            url={`${data?.promotional_banner_url}/${data?.basic_section_nearby}`}
          />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <Banners />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <FeaturedStores title="Featured Store" configData={configData} />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <RunningCampaigns />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <CommonConditions title="Common Conditions" />
        </CustomContainer>
      </Grid>
      {/*<Grid item xs={12}>*/}
      {/*  <CustomContainer>*/}
      {/*    <RedirectBanner />*/}
      {/*  </CustomContainer>*/}
      {/*</Grid>*/}
      <Grid
        item
        xs={12}
        sx={{
          position: "sticky",
          top: { xs: "47px", md: "92px" },
          zIndex: 999,
        }}
      >
        <CustomContainer>
          <Stores />
        </CustomContainer>
      </Grid>
      {orderDetailsModalOpen && !token && (
        <OrderDetailsModal orderDetailsModalOpen={orderDetailsModalOpen} />
      )}
    </Grid>
  );
};

Pharmacy.propTypes = {};

export default Pharmacy;
