interface Props {
    showLoader: boolean;
    contentList: string[] | [];
}

export const FileList = ({ showLoader, contentList }: Props) => {
    return (
        <Wrapper>
            {showLoader ? (
                <Loading />
            ) : contentList.length === 0 ? (
                <Empty />
            ) : (
                <ContentList contentList={contentList} />
            )}
        </Wrapper>
    );
};

interface WrapperProps {
    children: JSX.Element;
}

const Wrapper = ({ children }: WrapperProps) => {
    return (
        <>
            <div>
                <div className="flex place-items-center place-content-center my-2">File list</div>
                {children}
            </div>
        </>
    );
};

const Loading = () => <div className="my-2">Loading...</div>;

const Empty = () => <div className="my-2">File list is empty</div>;

interface ContetnListProps {
    contentList: [] | string[];
}

const ContentList = ({ contentList }: ContetnListProps) => {
    return (
        <>
            {contentList.map((name: string, key: number) => (
                <div className="my-2" key={key}>
                    {name}
                </div>
            ))}
        </>
    );
};
