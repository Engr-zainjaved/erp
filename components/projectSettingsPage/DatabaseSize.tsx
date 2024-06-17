import React from "react";
import Icon from "../icon/Icon";
import Tooltips from "../bootstrap/Tooltips";
import Accordion, { AccordionItem } from "../bootstrap/Accordion";
import Card, { CardBody } from "../bootstrap/Card";
import ListGroup, { ListGroupItem } from "../bootstrap/ListGroup";
import Alert from "../bootstrap/Alert";

const DatabaseSize = () => {
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Icon icon="Public" className="" color="dark" size="2x" forceFamily={null} />

            <h2 style={{ marginLeft: "10px" }}>Production Database Size</h2>
          </div>
        </div>
        <div className="col-md-6">
          <div>
            This project's production database has a size of <strong>1.0 GB. </strong> It consists
            of its PSQL Database of
            <strong>20.7 MB </strong> and its{" "}
            <Tooltips
              title="The calculation of the container's file system storage includes the filestore, log files, custom code, session data and temporary files. This computation does not take into account the Odoo repositories (odoo, enterprise, themes) and the `backup.daily` folder"
              isDisableElements
              isDisplayInline
            >
              <span style={{ color: "blue" }}>container filesystem</span>
            </Tooltips>{" "}
            of
            <strong> 1007.5 MB.</strong> Please note the sizes displayed here are not real time.
            <br />
            <br />
            The price per GB is fixed at <strong> $0.25</strong> per month. The natural database
            growth will automatically be synchronized with your subscription. You can provision more
            space should you need it for a large database import. The default shared hosting offer
            provides up to 512 GB of storage, while the dedicated server offer increases this limit
            to 4096 GB.
          </div>
          <div>
            <Accordion
              id="showDetails"
              tag="section"
              shadow="default"
              isFlush={false}
              color="light"
            >
              <AccordionItem
                id="details"
                title="Show details"
                headerTag="span"
                overWriteColor="primary"
              >
                <Card stretch>
                  <CardBody>
                    <ListGroup>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between">
                          Production Database
                          <span>1.0 GB</span>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between">
                          Backup 1 - Europe (France)
                          <span>1.0 GB</span>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between">
                          Backup 2 - Europe (France)
                          <span>1.0 GB</span>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between">
                          Backup 3 - America (Canada)
                          <span>1.0 GB</span>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between">
                          Staging Builds
                          <span>2.0 GB</span>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between" style={{ color: "gray" }}>
                          Other Builds (Free)
                          <span>0 KB</span>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between">
                          <strong>Total accounted storage</strong>
                          <strong>
                            <span>6.0 GB</span>
                          </strong>
                        </div>
                      </ListGroupItem>
                    </ListGroup>
                  </CardBody>
                </Card>
              </AccordionItem>
            </Accordion>
          </div>
          <Alert color="info" isLight className="mt-3">
            Trial project builds are limited to 1 GB in storage.
          </Alert>
        </div>
      </div>
      <hr style={{ margin: "5rem 0" }} />
    </>
  );
};

export default DatabaseSize;
