import { useEffect, useState } from "react";
import { useAuth } from "../store/authStore";
import api from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AuthorDashboard() {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get(`/author-api/articles/${currentUser._id}`);
        if (res.status === 200) {
          setArticles(res.data.payload);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load articles");
      }
    };

    if (currentUser) {
      fetchArticles();
    }
  }, [currentUser]);

  const navigateToAddArticle = () => {
    navigate("/add-article");
  };

  const handleEdit = (article) => {
    navigate("/add-article", { state: article });
  };

  const handleDelete = async (article) => {
    const newStatus = !article.isArticleActive;
    try {
      const res = await api.patch(`/author-api/articles/${article._id}/status`, { isArticleActive: newStatus });
      if (res.status === 200) {
        toast.success(res.data.message);
        setArticles(articles.map(art => art._id === article._id ? { ...art, isArticleActive: newStatus } : art));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Articles</h2>
        <button
          onClick={navigateToAddArticle}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add New Article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div
              key={article._id}
              className={`border rounded-lg p-4 shadow-sm ${
                !article.isArticleActive ? "bg-gray-100 opacity-75" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {article.category}
                </span>
                {!article.isArticleActive && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        Deleted
                    </span>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2 truncate">
                {article.title}
              </h3>
              <p className="text-gray-600 mb-4 h-20 overflow-hidden text-sm">
                {article.content.substring(0, 150)}...
              </p>
              
              <div className="flex justify-between mt-auto">
                <button
                    onClick={() => handleEdit(article)}
                    className="text-blue-600 hover:underline text-sm"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(article)}
                    className={`${article.isArticleActive ? 'text-red-600' : 'text-green-600'} hover:underline text-sm`}
                >
                    {article.isArticleActive ? "Delete" : "Restore"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No articles found. Start writing!
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthorDashboard;
