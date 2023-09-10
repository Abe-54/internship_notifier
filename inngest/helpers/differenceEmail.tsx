import { Internship } from "@/types/Internship";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { Diff } from "deep-diff";
import React from "react";

type DifferenceEmailProps = {
  addedInternships: Internship[];
  removedInternships: Internship[];
};

function groupByCompany(internships: Internship[]) {
  return internships.reduce((acc, internship) => {
    if (!acc[internship.company_name]) {
      acc[internship.company_name] = [];
    }
    acc[internship.company_name].push(internship);
    return acc;
  }, {} as Record<string, Internship[]>);
}

const DifferenceEmail = ({
  addedInternships,
  removedInternships,
}: DifferenceEmailProps) => {
  const groupedAdded = groupByCompany(addedInternships);
  const groupedRemoved = groupByCompany(removedInternships);

  return (
    <Html>
      <Head />
      <Preview>Internship Update Alert</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-black">
          <Container>
            <Section className="bg-white borderBlack my-10 px-10 py-4 rounded-md">
              <Heading className="leading-tight">
                Internship Update Alert
              </Heading>
              <Hr />
              <Section>
                <Row>
                  <Column>
                    <Heading className="leading-tight">Added</Heading>
                    {Object.entries(groupedAdded).map(
                      ([company, internships]) => (
                        <Section key={company}>
                          <Link
                            href={internships[0].company_url}
                            target="_blank"
                          >
                            {company}
                          </Link>
                          {internships.map((internship) => (
                            <React.Fragment key={internship.id}>
                              <Text className="ml-4">- {internship.title}</Text>
                              <Button href={internship.url} target="_blank">
                                Apply
                              </Button>
                            </React.Fragment>
                          ))}
                        </Section>
                      )
                    )}
                  </Column>
                  <Column>
                    <Heading className="leading-tight">Removed</Heading>
                    {Object.entries(groupedRemoved).map(
                      ([company, internships]) => (
                        <Section key={company}>
                          <Text>{company}</Text>
                          {internships.map((internship) => (
                            <Text key={internship.id} className="ml-4">
                              - {internship.title}
                            </Text>
                          ))}
                        </Section>
                      )
                    )}
                  </Column>
                </Row>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default DifferenceEmail;
