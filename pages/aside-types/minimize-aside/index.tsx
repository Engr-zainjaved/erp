import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useMinimizeAside from '../../../hooks/useMinimizeAside';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../../layout/SubHeader/SubHeader';
import Humans from '../../../assets/img/scene6.png';
import { pageLayoutTypesPagesMenu } from '../../../menu';
import CommonLayoutRightSubheader from '../../_layout/_subheaders/CommonLayoutRightSubheader';
import Page from '../../../layout/Page/Page';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';

const Index: NextPage = () => {
	useMinimizeAside();
	return (
		<PageWrapper>
			<Head>
				<title>{pageLayoutTypesPagesMenu.asideTypes.subMenu.minimizeAside.text}</title>
			</Head>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						list={[
							{ title: 'Page Layout', to: '/page-layouts' },
							{
								title: 'Header & Subheader',
								to: '/page-layouts/header-and-subheader',
							},
						]}
					/>
				</SubHeaderLeft>
				<CommonLayoutRightSubheader />
			</SubHeader>
			<Page>
				<div className='row d-flex align-items-center h-100'>
					<div
						className='col-12 d-flex justify-content-center'
						style={{ fontSize: 'calc(3rem + 3vw)' }}>
						<p>
							Minimize <span className='text-primary fw-bold mx-1'>Aside</span>
						</p>
					</div>
					<div className='col-12 d-flex align-items-baseline justify-content-center'>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={Humans}
							alt='Humans'
							style={{ height: '50vh', transform: 'translateX(3vw)' }}
						/>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export default Index;
