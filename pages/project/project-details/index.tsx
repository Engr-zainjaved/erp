import type { NextPage } from "next";
import Card, {
  CardBody,
  CardHeader,
  CardLabel,
  CardSubTitle,
  CardTitle,
} from "../../../components/bootstrap/Card";
import Page from "../../../layout/Page/Page";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";

const Index: NextPage = () => {
  return (
    <PageWrapper>
      <Page>
        <div className="row">
          <div className="col-xl-12">
            <Card>
              <CardHeader>
                <CardLabel>
                  <CardTitle>November 23, 2023</CardTitle>
                </CardLabel>
              </CardHeader>

              <CardBody>
                <div className="row g-4">
                  <div className="col-lg-12">
                    <Card shadow="sm" className="mb-0">
                      <CardHeader>
                        <CardLabel>
                          <CardTitle>
                            pass-odoo <small>22 days ago</small>
                          </CardTitle>
                          <CardSubTitle>STAGE CHANGES</CardSubTitle>
                        </CardLabel>
                      </CardHeader>
                      <CardBody>
                        Development builds are created with a fresh new database loading
                        demonstration data. <br></br>
                        Every commit on this branch will be installed, tested and deployed
                        automatically.<br></br>A DNS and mail catcher is setup for you to test
                        outgoing emails.
                        <br></br>
                        Builds in development branches are not meant to store sensible data and have
                        a short lifespan of a few days.
                        <br></br>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <Card>
              <CardHeader>
                <CardLabel>
                  <CardTitle>November 23, 2023</CardTitle>
                </CardLabel>
              </CardHeader>

              <CardBody>
                <div className="row g-4">
                  <div className="col-lg-12">
                    <Card shadow="sm" className="mb-0">
                      <CardHeader>
                        <CardLabel>
                          <CardTitle>
                            pass-odoo <small>22 days ago</small>
                          </CardTitle>
                          <CardSubTitle>STAGE CHANGES</CardSubTitle>
                        </CardLabel>
                      </CardHeader>
                      <CardBody>
                        Development builds are created with a fresh new database loading
                        demonstration data. <br></br>
                        Every commit on this branch will be installed, tested and deployed
                        automatically.<br></br>A DNS and mail catcher is setup for you to test
                        outgoing emails.
                        <br></br>
                        Builds in development branches are not meant to store sensible data and have
                        a short lifespan of a few days.
                        <br></br>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </Page>
    </PageWrapper>
  );
};

export default Index;
