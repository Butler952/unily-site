import { useState, useEffect } from "react";
import fire from "../../config/fire-config";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import mixpanel from "mixpanel-browser";
import mixpanelConfig from "config/mixpanel-config";

import ChangeEmailSection from "./components/changeEmailSection";
import DeleteAccountSection from "./components/deleteAccountSection";
import SidebarLayout from "components/layout/SidebarLayout";

const Settings = () => {
  const router = useRouter();
  const [userData, setUserData] = useState("");
  const [allUserData, setAllUserData] = useState("");

  useEffect(() => {
    mixpanel.init(mixpanelConfig);
    mixpanel.track("Settings");
    if (router.query.upgrade == "success") {
      toast("Upgraded to Premium");
    }
    const unsubscribe = fire.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserData(user);
      } else {
        router.push("/users/login");
      }
    });
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Settings | Vitaely.me</title>
      </Head>
      <div
        className="d-flex flex-column align-items-center px-3 px-md-5 w-100"
        style={{ paddingTop: "48px", paddingBottom: "160px" }}
      >
        <div className="w-100" style={{ maxWidth: "560px" }}>
          <div className="d-flex flex-row align-items-center justify-content-start mb-5">
            <h2 className="mb-0">Settings</h2>
          </div>
          <div className="d-flex flex-column gap-5">
            {/* <ul>
              <li>delete account</li>
              <li>edit login details/method</li>
            </ul> */}
            <div>
              <h5>Sign in methods</h5>
              <ChangeEmailSection
                userData={userData}
                allUserData={allUserData}
              />
            </div>
            <div>
              <h5>Danger zone</h5>
              <DeleteAccountSection userData={userData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add layout function here
Settings.getLayout = function getLayout(page) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Settings;
